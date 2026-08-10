import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { MemberList } from './features/members/member-list/member-list';
import { MemberDetails } from './features/members/member-details/member-details';
import { Lists } from './features/lists/lists';
import { Messages } from './features/messages/messages';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    component: Home,
    path: '',
  },
  {
    component: MemberList,
    path: 'member-list',
    canActivate: [authGuard]
  },
  {
    component: MemberDetails,
    path: 'member-list/:id',
  },
  {
    component: Lists,
    path: 'lists',
  },
  {
    component: Messages,
    path: 'messages',
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: Home,
  },
];
