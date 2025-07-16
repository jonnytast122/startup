import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { signupUser } from './api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SignupFormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  referral: string;
};

export default function SignupFormFeature({
  onSuccess,
  className,
}: {
  onSuccess?: () => void;
  className?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();
  const mutation = useMutation<unknown, Error, SignupFormData>({
    mutationFn: (data: SignupFormData) => signupUser(data),
    onSuccess,
  });

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px]">
        <CardContent className="grid p-0 md:grid-cols-[3fr,2.1fr] min-h-[400px] md:min-h-[600px]">
          <form
            className="p-14 md:p-16 flex flex-col justify-center"
            onSubmit={handleSubmit(data => mutation.mutate(data))}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start">
                <h1 className="font-vietname text-lg font-medium text-dark-gray">
                  A small step for you, <br /> a giant leap for your business.
                </h1>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="font-custom"
                  {...register('firstName', { required: true })}
                  id="first-name"
                  type="text"
                  placeholder="First Name"
                />
                <Input
                  className="font-custom"
                  {...register('lastName', { required: true })}
                  id="last-name"
                  type="text"
                  placeholder="Last Name"
                />
              </div>
              <div className="grid gap-2">
                <Input
                  className="font-custom"
                  {...register('phoneNumber', { required: true })}
                  id="phone-number"
                  type="tel"
                  placeholder="Phone Number"
                />
              </div>
              <div className="grid gap-2">
                <Select
                  onValueChange={value => {
                    // react-hook-form controlled workaround
                    // setValue("referral", value);
                  }}
                >
                  <SelectTrigger className="w-full text-dark-gray font-custom">
                    <SelectValue placeholder="Where did you first hear about us?" />
                  </SelectTrigger>
                  <SelectContent className="w-full font-custom">
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="friend_or_family">
                      Friend or Family
                    </SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-56 rounded-full mt-4 font-vietname text-2sm"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Signing Up...' : "LET'S GO"}
                </Button>
              </div>
              {mutation.isError && (
                <div className="text-red-500 text-center">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : 'Signup failed'}
                </div>
              )}
              <div className="text-center text-2sm font-vietname-thin text-light-gray">
                Already had an account?{' '}
                <a href="/signin" className="text-blue">
                  Sign in
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
        By signing up, you agree to our{' '}
        <a
          href="https://connecteam.com/terms-conditions/"
          className="inline-block sm:py-1 lg:py-0"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="https://connecteam.com/privacy/"
          className="inline-block sm:py-1 lg:py-0"
        >
          Privacy Notice
        </a>
        .<br />
        We use the information provided by you to contact you (including via
        email) about our products and services; You may <br />
        always opt out from our mailing lists in accordance with the Privacy
        Notice.
      </div>
    </div>
  );
}
