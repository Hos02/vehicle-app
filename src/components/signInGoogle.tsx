
import { signIn } from "@/auth"

export default function SignInGoogle() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn("google")
      }}
    >
      <button type="submit" className="border-2 border-gray-400 rounded-full p-3 font-medium">Signin with Google</button>
    </form>
  )
} 