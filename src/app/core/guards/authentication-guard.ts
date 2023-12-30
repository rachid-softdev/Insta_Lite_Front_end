import { inject } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, CanActivateFn } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { User } from '../models/user/user.model';
import { Role } from '../constants/ERole';
import { AuthenticationService } from '../services/authentication/authentication.service';

/**
 * Source : https://angular.io/guide/router-tutorial-toh#canactivate-requiring-authentication
 */
export const AuthenticationGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  const authenticationService: AuthenticationService = inject(AuthenticationService);
  const tokenStorageService: TokenStorageService = inject(TokenStorageService);
  const user: User | null = tokenStorageService.getUser();
  let isLoggedIn: boolean = user ? true : false;
  if (isLoggedIn) {
    const userRole: Role | null | undefined = user?.getRole;
    if (!userRole || !userRole.getName || (route.data['role'] && route.data['role'].indexOf(userRole.getName) === -1)) {
      authenticationService.logout();
      router.navigate(['/login']);
      isLoggedIn = false;
      return false;
    }
    isLoggedIn = true;
    // Vérification de l'authentification au niveau de l'API
    authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
      /**
       * Ce implémentation s'exécute de manière asynchrone car c'est un appel vers l'api donc je fais quand même la redirection même
       * si le code après est déja exécuté
       */
      if (!isAuthenticated || !isLoggedIn) {
        authenticationService.logout();
        router.navigate(['/login']);
      }
    });
    return true;
  }
  function generateSessionId() {
    return Math.floor(Math.random() * 1000000000) + 1;
  }
  const sessionId = generateSessionId();
  // Set our navigation extras object
  // that contains our global query params and fragment
  const navigationExtras: NavigationExtras = {
    queryParams: { session_id: sessionId },
    fragment: 'anchor',
  };
  authenticationService.logout();
  // Redirect to the login page with extras
  return router.createUrlTree(['/login'], navigationExtras);
};
