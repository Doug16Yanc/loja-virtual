package lojavirtual.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ItemPedido.
 */
@Entity
@Table(name = "item_pedido")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ItemPedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 1)
    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "preco_unitario", precision = 21, scale = 2, nullable = false)
    private BigDecimal precoUnitario;

    @ManyToOne(fetch = FetchType.LAZY)
    private Produto produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "cliente" }, allowSetters = true)
    private Pedido pedido;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ItemPedido id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantidade() {
        return this.quantidade;
    }

    public ItemPedido quantidade(Integer quantidade) {
        this.setQuantidade(quantidade);
        return this;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getPrecoUnitario() {
        return this.precoUnitario;
    }

    public ItemPedido precoUnitario(BigDecimal precoUnitario) {
        this.setPrecoUnitario(precoUnitario);
        return this;
    }

    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
    }

    public Produto getProduto() {
        return this.produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public ItemPedido produto(Produto produto) {
        this.setProduto(produto);
        return this;
    }

    public Pedido getPedido() {
        return this.pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public ItemPedido pedido(Pedido pedido) {
        this.setPedido(pedido);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ItemPedido)) {
            return false;
        }
        return getId() != null && getId().equals(((ItemPedido) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ItemPedido{" +
            "id=" + getId() +
            ", quantidade=" + getQuantidade() +
            ", precoUnitario=" + getPrecoUnitario() +
            "}";
    }
}
