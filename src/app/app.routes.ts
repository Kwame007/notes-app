import { Routes } from '@angular/router';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { NotePageComponent } from './components/notes-page/notes-page.component';
import { authGuard } from './services/auth.guard';
import { NoteEditorComponent } from './components/notes-editor/notes-editor.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes/new',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: AuthFormComponent,
  },
  {
    path: 'register',
    component: AuthFormComponent,
  },
  {
    path: 'notes',
    component: NotePageComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'new',
        pathMatch: 'full',
      },
      {
        path: 'new',
        component: NoteEditorComponent,
      },
      {
        path: ':id',
        component: NoteEditorComponent,
      },
    ],
  },
  // { path: '**', component: PageNotFoundComponent },
];
