import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IProduto } from '../produto.model';

@Component({
  selector: 'jhi-produto-detail',
  templateUrl: './produto-detail.component.html',
  imports: [SharedModule, RouterModule],
  standalone: true,
})
export class ProdutoDetailComponent {
  produto = input<IProduto | null>(null);

  previousState(): void {
    window.history.back();
  }
}
