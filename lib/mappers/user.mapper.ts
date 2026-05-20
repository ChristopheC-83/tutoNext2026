import { UserDTO } from "@/types";
import { User } from "@prisma/client";

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
}
