import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}

function LoginForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px]">
        <CardContent className="grid p-0 md:grid-cols-[3fr,2.1fr] min-h-[400px] md:min-h-[600px] ">
          <form className="p-14 md:p-16 flex flex-col justify-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start">
                <h1 className="font-vietname text-lg font-medium text-dark-gray">
                  A small step for you, <br /> a giant leap for your business.
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="font-custom"
                  id="first-name"
                  type="text"
                  placeholder="First Name"
                  required
                />
                <Input
                  className="font-custom"
                  id="last-name"
                  type="text"
                  placeholder="Last Name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Input
                  className="font-custom"
                  id="phone-number"
                  type="phone-number"
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Select>
                  <SelectTrigger className="w-full text-dark-gray font-custom">
                    <SelectValue placeholder="Where did you first hear about us?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center">
                <Button type="submit" className="w-56 rounded-full mt-4 font-vietname text-2sm">
                  LET'S GO
                </Button>
              </div>
              <div className="text-center text-2sm font-vietname text-light-gray">
                Already had an account{" "}
                <a href="#" className="text-blue">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="hidden md:flex items-center justify-center bg-blue-100">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-60 h-60 object-contain"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-center mt-4 font-custom text-sm text-light-gray [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary sm:max-w-md sm:mx-auto sm:leading-relaxed sm:px-4 lg:max-w-none lg:px-0">
        By signing up, you agree to our{" "}
        <a
          href="https://connecteam.com/terms-conditions/"
          className="inline-block sm:py-1 lg:py-0"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="https://connecteam.com/privacy/"
          className="inline-block sm:py-1 lg:py-0"
        >
          Privacy Notice
        </a>
        .<br />
        We use the information provided by you to contact you (including
        viaemail) about our products and services; You may <br />
        always opt out from our mailing lists in accordance with the
        PrivacyNotice.
      </div>
    </div>
  );
}
