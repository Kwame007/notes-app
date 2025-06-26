import { Routes } from '@angular/router';
import { NotesDashboardComponent } from './components/notes-dashboard/notes-dashboard.component';
import { ArchivedNotesComponent } from './components/archived-notes/archived-notes.component';
import { NoteDetailComponent } from './components/note-detail/note-detail.component';
import { NoteCreateComponent } from './components/note-create/note-create.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
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
    component: NotesDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'notes/:id',
    component: NoteDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'archived',
    component: ArchivedNotesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'create',
    component: NoteCreateComponent,
    canActivate: [authGuard],
  },
  // { path: '**', component: PageNotFoundComponent },
];
