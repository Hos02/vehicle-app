import { signIn } from "@/auth"

export default function SignInGithub() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn("github")

      }}
    >
      <button type="submit" className="border-2 bg-black rounded-full p-3 text-white font-medium">Signin with GitHub</button>
    </form>
  )
} 