import { UserMenuItem } from '../model/user-menu.model';

export class UserMenu {
  public static pages: UserMenuItem[] = [
    {
      group: 'Fonctionnalités',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Accueil',
          route: '/user/home',
          /*
          children: [
            { label: 'Google', route: 'google.fr' },
            { label: 'Amazon', route: 'amazon.fr' },
          ],
          */
        },
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Images',
          route: '/user/images',
          /*
          children: [
            { label: 'Google', route: 'google.fr' },
            { label: 'Amazon', route: 'amazon.fr' },
          ],
          */
        },
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Mon profil',
          route: '/user/profile',
          /*
          children: [
            { label: 'Google', route: 'google.fr' },
            { label: 'Amazon', route: 'amazon.fr' },
          ],
          */
        },
        /*
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Images',
          route: '/images',
          children: [
            { label: 'Google', route: 'google.fr' },
            { label: 'Amazon', route: 'amazon.fr' },
          ],
        },
        */
      ],
    },
    /*
    {
      group: 'Collaboration',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/download.svg',
          label: 'Download',
          route: '/download',
        },
        {
          icon: 'assets/icons/heroicons/outline/gift.svg',
          label: 'Gift Card',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Users',
          route: '/users',
        },
      ],
    },
    {
      group: 'Config',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Settings',
          route: '/settings',
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notifications',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Folders',
          route: '/folders',
          children: [
            { label: 'Current Files', route: '/folders/current-files' },
            { label: 'Downloads', route: '/folders/download' },
            { label: 'Trash', route: '/folders/trash' },
          ],
        },
      ],
    },
    */
  ];
}
