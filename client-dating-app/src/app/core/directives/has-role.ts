import { Directive, inject, TemplateRef, ViewContainerRef, effect, input } from '@angular/core';
import { Auth } from '../../auth/services/auth';

@Directive({
  selector: '[datingHasRole]',
})
export class HasRole {
  private readonly authService = inject(Auth);
  //The input must be the same name as the directive selector, but camelCased. In this case, datingHasRole
  datingHasRole = input.required<string[]>();

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<unknown>);

  //Used effect because the currentUser is a signal and we want to react to changes in the signal
  datingEffect = effect(() => {
    const userRoles = this.authService.currentUser();
    this.viewContainerRef.clear();
    if (userRoles?.roles?.some((role) => this.datingHasRole().includes(role))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  });
}
