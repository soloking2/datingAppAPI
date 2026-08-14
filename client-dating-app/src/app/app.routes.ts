import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { MemberList } from './features/members/member-list/member-list';
import { MemberDetails } from './features/members/member-details/member-details';
import { Lists } from './features/lists/lists';
import { Messages } from './features/messages/messages';
import { authGuard } from './core/guards/auth-guard';
import { NotFound } from './shared/not-found/not-found';
import { ServerError } from './shared/server-error/server-error';
import { MemberProfile } from './features/members/member-profile/member-profile';
import { MemberPhotos } from './features/members/member-photos/member-photos';
import { MemberMessages } from './features/members/member-messages/member-messages';
import { memberResolverResolver } from './features/members/resolvers/member-resolver-resolver';
import { preventUnsavedChangesGuard } from './core/guards/prevent-unsaved-changes-guard';

export const routes: Routes = [
  {
    component: Home,
    path: '',
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        component: MemberList,
        path: 'member-list',
      },
      {
        component: MemberDetails,
        path: 'member-list/:id',
        runGuardsAndResolvers: 'always',
        resolve: { member: memberResolverResolver },
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            component: MemberProfile,
            title: 'Profile',
            canDeactivate: [preventUnsavedChangesGuard]
          },
          {
            path: 'photos',
            component: MemberPhotos,
            title: 'Photos',
          },
          {
            path: 'messages',
            component: MemberMessages,
            title: 'Messages',
          },
        ],
      },
      {
        component: Lists,
        path: 'lists',
      },
      {
        component: Messages,
        path: 'messages',
      },
    ],
  },

  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    component: ServerError,
    path: 'server-error',
  },
  {
    path: '**',
    component: NotFound,
  },
];
