//  cet helper permet de afficher des logs d'erreur  uniquement en dev
//  qd on ne connait pas un type, on met unknown
//  on évitera undefined, ou pire, any

export function safeLogger(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log("SAFE DEV LOGS :");
    console.log(error);
  }
}
