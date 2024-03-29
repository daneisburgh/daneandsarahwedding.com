import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { UserGuard } from './shared/guards/user/user.guard';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
    { path: 'about-us', loadChildren: './pages/about-us/about-us.module#AboutUsPageModule' },
    { path: 'gallery/:galleryName', loadChildren: './pages/gallery/gallery.module#GalleryPageModule' },
    { path: 'info', loadChildren: './pages/info/info.module#InfoPageModule' },
    { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [UserGuard] },
    { path: 'error/:statusCode', loadChildren: './pages/error/error.module#ErrorPageModule' },
    { path: '**', loadChildren: './pages/error/error.module#ErrorPageModule' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
