package lojavirtual.domain;

import static lojavirtual.domain.AssertUtils.bigDecimalCompareTo;
import static org.assertj.core.api.Assertions.assertThat;

public class ItemPedidoAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertItemPedidoAllPropertiesEquals(ItemPedido expected, ItemPedido actual) {
        assertItemPedidoAutoGeneratedPropertiesEquals(expected, actual);
        assertItemPedidoAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertItemPedidoAllUpdatablePropertiesEquals(ItemPedido expected, ItemPedido actual) {
        assertItemPedidoUpdatableFieldsEquals(expected, actual);
        assertItemPedidoUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertItemPedidoAutoGeneratedPropertiesEquals(ItemPedido expected, ItemPedido actual) {
        assertThat(actual)
            .as("Verify ItemPedido auto generated properties")
            .satisfies(a -> assertThat(a.getId()).as("check id").isEqualTo(expected.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertItemPedidoUpdatableFieldsEquals(ItemPedido expected, ItemPedido actual) {
        assertThat(actual)
            .as("Verify ItemPedido relevant properties")
            .satisfies(a -> assertThat(a.getQuantidade()).as("check quantidade").isEqualTo(expected.getQuantidade()))
            .satisfies(a ->
                assertThat(a.getPrecoUnitario())
                    .as("check precoUnitario")
                    .usingComparator(bigDecimalCompareTo)
                    .isEqualTo(expected.getPrecoUnitario())
            );
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertItemPedidoUpdatableRelationshipsEquals(ItemPedido expected, ItemPedido actual) {
        assertThat(actual)
            .as("Verify ItemPedido relationships")
            .satisfies(a -> assertThat(a.getProduto()).as("check produto").isEqualTo(expected.getProduto()))
            .satisfies(a -> assertThat(a.getPedido()).as("check pedido").isEqualTo(expected.getPedido()));
    }
}
