import AccountForm from "@/components/auth/AccountForm";

export const metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-seafoam/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-forest/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-hand -rotate-2 text-2xl text-forest">
            join the community
          </span>
          <h1 className="display mt-1 text-4xl font-extrabold text-ink sm:text-5xl">
            Create your account
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink/60">
            One account for every order — track delivery from our studio to your
            door.
          </p>
        </div>
        <div className="mt-10">
          <AccountForm mode="register" />
        </div>
      </div>
    </div>
  );
}