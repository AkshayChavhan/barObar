import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">barObar</CardTitle>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Registration is managed by your administrator. Please contact them for
          account access.
        </p>
        <p className="text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
