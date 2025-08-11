import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { Link } from "next-view-transitions";

export default function NotAuthenticated() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShieldAlert className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <CardTitle className="text-2xl font-bold">
            401 - No autorizado
          </CardTitle>
          <CardDescription>
            Debe iniciar sesión para acceder a esta página.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Inicie sesión en su cuenta para ver este contenido. Si no tiene una
            cuenta, puede registrarse de forma gratuita.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signup">Crear Cuenta</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
