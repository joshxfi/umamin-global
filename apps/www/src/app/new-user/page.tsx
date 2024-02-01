import { UsernameSettings } from "@/components/settings/username";

export default function NewUser() {
  return (
    <section className="container">
      <h1 className="text-lg font-medium">Hello!</h1>
      <p className="text-muted-foreground text-sm">
        Before we get started, you need to come up with your username. You can
        still change it later. 
      </p>

      <div className="mt-12">
        <UsernameSettings />
      </div>
    </section>
  );
}
