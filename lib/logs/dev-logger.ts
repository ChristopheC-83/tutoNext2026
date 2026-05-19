//  cet helper permet de afficher des logs d'erreur  uniquement en dev

export function safeLogger(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log("SAFE DEV LOGS :");
    console.log(error);
  }
}
