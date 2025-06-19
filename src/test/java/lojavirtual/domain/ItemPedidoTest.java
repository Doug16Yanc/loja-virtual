package lojavirtual.domain;

import static lojavirtual.domain.ItemPedidoTestSamples.*;
import static lojavirtual.domain.PedidoTestSamples.*;
import static lojavirtual.domain.ProdutoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import lojavirtual.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ItemPedidoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ItemPedido.class);
        ItemPedido itemPedido1 = getItemPedidoSample1();
        ItemPedido itemPedido2 = new ItemPedido();
        assertThat(itemPedido1).isNotEqualTo(itemPedido2);

        itemPedido2.setId(itemPedido1.getId());
        assertThat(itemPedido1).isEqualTo(itemPedido2);

        itemPedido2 = getItemPedidoSample2();
        assertThat(itemPedido1).isNotEqualTo(itemPedido2);
    }

    @Test
    void produtoTest() {
        ItemPedido itemPedido = getItemPedidoRandomSampleGenerator();
        Produto produtoBack = getProdutoRandomSampleGenerator();

        itemPedido.setProduto(produtoBack);
        assertThat(itemPedido.getProduto()).isEqualTo(produtoBack);

        itemPedido.produto(null);
        assertThat(itemPedido.getProduto()).isNull();
    }

    @Test
    void pedidoTest() {
        ItemPedido itemPedido = getItemPedidoRandomSampleGenerator();
        Pedido pedidoBack = getPedidoRandomSampleGenerator();

        itemPedido.setPedido(pedidoBack);
        assertThat(itemPedido.getPedido()).isEqualTo(pedidoBack);

        itemPedido.pedido(null);
        assertThat(itemPedido.getPedido()).isNull();
    }
}
