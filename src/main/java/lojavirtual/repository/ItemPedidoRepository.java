package lojavirtual.repository;

import lojavirtual.domain.ItemPedido;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ItemPedido entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {}
