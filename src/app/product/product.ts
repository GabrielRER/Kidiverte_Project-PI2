import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  produtos: any[] = [];
  produto: any = {};

  constructor(private service: ProductService) {}

  ngOnInit() {
    this.listar();
  }

  listar() {
    this.service.getAll().subscribe((res: any) => {
      this.produtos = res;
    });
  }

  salvar() {
    if (this.produto.id) {
      this.service.update(this.produto).subscribe(() => {
        alert('Atualizado!');
        this.reset();
      });
    } else {
      this.service.add(this.produto).subscribe(() => {
        alert('Cadastrado!');
        this.reset();
      });
    }
  }

  editar(p: any) {
    this.produto = { ...p };
  }

  excluir(id: number) {
    this.service.delete(id).subscribe(() => {
      alert('Excluído!');
      this.listar();
    });
  }

  reset() {
    this.produto = {};
    this.listar();
  }
}
