import { TestBed } from '@angular/core/testing';
import { EditViewContainerComponent } from './edit-view.container.component';

describe(EditViewContainerComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(EditViewContainerComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(EditViewContainerComponent);
  });

});
