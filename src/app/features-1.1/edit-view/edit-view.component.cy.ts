import { TestBed } from '@angular/core/testing';
import { ListViewContainerComponent } from './edit-view.component';

describe(ListViewContainerComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(ListViewContainerComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(ListViewContainerComponent);
    cy.get('li')
  });


});
