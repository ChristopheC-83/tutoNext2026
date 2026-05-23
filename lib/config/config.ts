// le "!" est une assertion TS, 
// elle dit a TS : je suis sur que cette variable n'est pas undefined
const secret = process.env.JWT_SECRET!;


//  si pas de Secret (vide ou undefined) => on jette une erreur
//  l'app crash

if (!secret) {
  throw new Error("JWT_SECRET env variable is required");
}


export const JWT_SECRET = secret;

// ce fichier permet de valider la variable d'environnement du secret JWT
