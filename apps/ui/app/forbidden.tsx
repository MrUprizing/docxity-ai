import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldBan } from "lucide-react";
import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShieldBan className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <CardTitle className="text-2xl font-bold">
            403 - Acceso denegado
          </CardTitle>
          <CardDescription>
            No tiene permisos para acceder a este recurso.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Revise la url o contacte al administrador del equipo. Si cree que
            esto es un error, por favor intente nuevamente más tarde.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full text-lg">
            <Link href="/login">Iniciar sesión con un usuario diferente</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
