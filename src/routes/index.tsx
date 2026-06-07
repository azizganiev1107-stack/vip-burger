import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      href: "/products", // перенаправляем на админ-панель
      replace: true,
    });
  },
  component: HomeComponent,
});

function HomeComponent() {
  return <div>Qayta baǵdarlaw...</div>;
}