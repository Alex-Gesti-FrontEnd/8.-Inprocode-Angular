import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { MapComponent } from './features/map/map.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { GraphicsComponent } from './features/graphics/graphics.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'graphics',
    component: GraphicsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
