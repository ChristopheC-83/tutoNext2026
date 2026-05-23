//  UserFromToken représente le payload du JWT
//  => payload, données transportées
//  on pourrait y rajouter le role et le TTL du token
//  rien de plus
//  jwt exposé en front et back et pas toujours frais au niveau des données
//  on ne doit pas le surcharger
// 

export type UserFromToken = {
  userId: string;
  email: string;
};
