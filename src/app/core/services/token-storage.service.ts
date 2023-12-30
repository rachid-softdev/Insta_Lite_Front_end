import { Injectable } from '@angular/core';
import { User } from '../models/user/user.model';
import { Role } from '../constants/ERole';

const TOKEN_KEY = 'authentication_token';
const USER_KEY = 'authentication_user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  /**
   * Enregistre le jeton d'authentification dans sessionStorage.
   * @param token Le jeton d'authentification à enregistrer.
   */
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Supprime le jeton d'authentification de sessionStorage.
   */
  public removeToken(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Efface toutes les données de session stockées.
   */
  public clearToken(): void {
    window.sessionStorage.clear();
  }

  /**
   * Récupère le jeton d'authentification de sessionStorage.
   * @returns Le jeton d'authentification ou null s'il n'est pas trouvé.
   */
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Récupère les informations de l'utilisateur depuis sessionStorage.
   * @return Les informations de l'utilisateur ou null s'il n'est pas trouvé.
   */
  public getUser(): User | null {
    const userItem = window.sessionStorage.getItem(USER_KEY);
    if (userItem) {
      const userParsed = JSON.parse(userItem);
      let user: User = new User();
      user = Object.assign(user, userParsed);
      let role: Role = new Role();
      role = Object.assign(role, userParsed._role);
      user.setRole = role;
      /**
       * Création de l'objet car dans la méthode JSON.parse, elle ne restaure pas les get et set
       * Source : https://stackoverflow.com/questions/50772972/why-getters-setters-are-missing-after-stringifying-and-parsing-back-to-an-object
       */
      return user;
    }
    return null;
  }

  /**
   * Seconde Version de getUser en sélectionnant les champs précis au lieu d'utiliser Object.assign
   */
  public getUserSecondVersion(): User | null {
    const userItem = window.sessionStorage.getItem(USER_KEY);
    if (userItem) {
      const userParsed = JSON.parse(userItem);
      let role: Role = new Role();
      role = Object.assign(role, userParsed._role);
      /**
       * Création de l'objet car dans la méthode JSON.parse, elle ne restaure pas les get et set
       * Source : https://stackoverflow.com/questions/50772972/why-getters-setters-are-missing-after-stringifying-and-parsing-back-to-an-object
       */
      return new User(
        userParsed._publicId,
        userParsed._createdAt,
        userParsed._updatedAt,
        userParsed._lastname,
        userParsed._firstname,
        userParsed._email,
        userParsed._password,
        role,
      );
    }
    return null;
  }

  /**
   * Enregistre les informations de l'utilisateur dans sessionStorage.
   * @param user Les informations de l'utilisateur à enregistrer.
   */
  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}
