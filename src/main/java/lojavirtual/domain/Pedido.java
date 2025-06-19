package lojavirtual.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pedido.
 */
@Entity
@Table(name = "pedido")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "data_instant", nullable = false)
    private Instant dataInstant;

    @NotNull
    @Column(name = "status_pedido", nullable = false)
    private String statusPedido;

    @ManyToOne(fetch = FetchType.LAZY)
    private Cliente cliente;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pedido id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDataInstant() {
        return this.dataInstant;
    }

    public Pedido dataInstant(Instant dataInstant) {
        this.setDataInstant(dataInstant);
        return this;
    }

    public void setDataInstant(Instant dataInstant) {
        this.dataInstant = dataInstant;
    }

    public String getStatusPedido() {
        return this.statusPedido;
    }

    public Pedido statusPedido(String statusPedido) {
        this.setStatusPedido(statusPedido);
        return this;
    }

    public void setStatusPedido(String statusPedido) {
        this.statusPedido = statusPedido;
    }

    public Cliente getCliente() {
        return this.cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Pedido cliente(Cliente cliente) {
        this.setCliente(cliente);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pedido)) {
            return false;
        }
        return getId() != null && getId().equals(((Pedido) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pedido{" +
            "id=" + getId() +
            ", dataInstant='" + getDataInstant() + "'" +
            ", statusPedido='" + getStatusPedido() + "'" +
            "}";
    }
}
