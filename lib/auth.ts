import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            organization: true,
            instructorProfile: true,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.avatar,
          role: user.role,
          organizationId: user.organizationId,
          profileCompleted: user.profileCompleted,
          onboardingStep: user.onboardingStep,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          // Default role for Google OAuth users
          role: "STUDENT",
          organizationId: null,
          profileCompleted: false,
          onboardingStep: 0,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            // Create new user from Google profile
            const [firstName, ...lastNameParts] = user.name?.split(" ") || ["", ""]
            const lastName = lastNameParts.join(" ") || ""

            await prisma.user.create({
              data: {
                email: user.email!,
                firstName: firstName,
                lastName: lastName,
                avatar: user.image,
                role: "STUDENT", // Default role
                profileCompleted: false,
                onboardingStep: 1, // They'll need to complete onboarding
                emailVerified: new Date(), // Google emails are verified
              },
            })
          }
          return true
        } catch (error) {
          console.error("Error creating user from Google OAuth:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.organizationId = user.organizationId
        token.profileCompleted = user.profileCompleted
        token.onboardingStep = user.onboardingStep
      }

      // If this is a Google sign-in, fetch the latest user data
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            role: true,
            organizationId: true,
            profileCompleted: true,
            onboardingStep: true,
          },
        })

        if (dbUser) {
          token.role = dbUser.role
          token.organizationId = dbUser.organizationId
          token.profileCompleted = dbUser.profileCompleted
          token.onboardingStep = dbUser.onboardingStep
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.organizationId = token.organizationId as string
        session.user.profileCompleted = token.profileCompleted as boolean
        session.user.onboardingStep = token.onboardingStep as number
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle post-login redirects
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (account?.provider === "google" && isNewUser) {
        console.log(`New Google user created: ${user.email}`)
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
}
