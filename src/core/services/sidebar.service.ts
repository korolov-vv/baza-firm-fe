import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  public isSidebarCollapsed$: Observable<boolean> = this.isSidebarCollapsedSubject.asObservable();

  get isSidebarCollapsed(): boolean {
    return this.isSidebarCollapsedSubject.value;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsedSubject.next(!this.isSidebarCollapsedSubject.value);
  }

  showSidebar(): void {
    this.isSidebarCollapsedSubject.next(false);
  }
}