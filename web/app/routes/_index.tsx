import { LoaderFunction, redirect } from '@remix-run/node';

export const loader: LoaderFunction = () => {
  return redirect('/login');
};

export default function Index() {
  return null;
}
