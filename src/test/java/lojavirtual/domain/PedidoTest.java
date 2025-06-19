package lojavirtual.domain;

import static lojavirtual.domain.ClienteTestSamples.*;
import static lojavirtual.domain.PedidoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import lojavirtual.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PedidoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pedido.class);
        Pedido pedido1 = getPedidoSample1();
        Pedido pedido2 = new Pedido();
        assertThat(pedido1).isNotEqualTo(pedido2);

        pedido2.setId(pedido1.getId());
        assertThat(pedido1).isEqualTo(pedido2);

        pedido2 = getPedidoSample2();
        assertThat(pedido1).isNotEqualTo(pedido2);
    }

    @Test
    void clienteTest() {
        Pedido pedido = getPedidoRandomSampleGenerator();
        Cliente clienteBack = getClienteRandomSampleGenerator();

        pedido.setCliente(clienteBack);
        assertThat(pedido.getCliente()).isEqualTo(clienteBack);

        pedido.cliente(null);
        assertThat(pedido.getCliente()).isNull();
    }
}
