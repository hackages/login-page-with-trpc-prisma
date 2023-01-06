import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => { // POST
      const email = input.email;

      console.log({email});

      // do something with email
      // check if email exists in db
      let user = await ctx.prisma.user.findUnique({
        where: {
          email,
        }
      })

      if (!user) { 
        /// create user if not exists
        user = await ctx.prisma.user.create({
          data: {
            email,
          }
        })
      }
      

      // create session token 
      const token = await ctx.prisma.loginToken.create({
        data: {
          user: {
            connect: {
              id: user.id,
            }
          }
        }
      })

      // Send email with token
      console.log({token});
      

      return null
    }),
});
