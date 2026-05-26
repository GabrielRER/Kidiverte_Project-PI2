import { Routes } from '@angular/router';
import { ProfilePage } from './components/profile-page/profile-page';  
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';

export const routes: Routes = [
    {path: '', component: ProfilePage},
    {path: 'login', component: LoginPage},
    {path: 'register', component: RegisterPage}
];
