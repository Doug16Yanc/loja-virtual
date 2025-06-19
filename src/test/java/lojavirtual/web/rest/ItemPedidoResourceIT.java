package lojavirtual.web.rest;

import static lojavirtual.domain.ItemPedidoAsserts.*;
import static lojavirtual.web.rest.TestUtil.createUpdateProxyForBean;
import static lojavirtual.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import lojavirtual.IntegrationTest;
import lojavirtual.domain.ItemPedido;
import lojavirtual.repository.ItemPedidoRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ItemPedidoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemPedidoResourceIT {

    private static final Integer DEFAULT_QUANTIDADE = 1;
    private static final Integer UPDATED_QUANTIDADE = 2;

    private static final BigDecimal DEFAULT_PRECO_UNITARIO = new BigDecimal(0);
    private static final BigDecimal UPDATED_PRECO_UNITARIO = new BigDecimal(1);

    private static final String ENTITY_API_URL = "/api/item-pedidos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemPedidoMockMvc;

    private ItemPedido itemPedido;

    private ItemPedido insertedItemPedido;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemPedido createEntity() {
        return new ItemPedido().quantidade(DEFAULT_QUANTIDADE).precoUnitario(DEFAULT_PRECO_UNITARIO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemPedido createUpdatedEntity() {
        return new ItemPedido().quantidade(UPDATED_QUANTIDADE).precoUnitario(UPDATED_PRECO_UNITARIO);
    }

    @BeforeEach
    void initTest() {
        itemPedido = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedItemPedido != null) {
            itemPedidoRepository.delete(insertedItemPedido);
            insertedItemPedido = null;
        }
    }

    @Test
    @Transactional
    void createItemPedido() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ItemPedido
        var returnedItemPedido = om.readValue(
            restItemPedidoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(itemPedido)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ItemPedido.class
        );

        // Validate the ItemPedido in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertItemPedidoUpdatableFieldsEquals(returnedItemPedido, getPersistedItemPedido(returnedItemPedido));

        insertedItemPedido = returnedItemPedido;
    }

    @Test
    @Transactional
    void createItemPedidoWithExistingId() throws Exception {
        // Create the ItemPedido with an existing ID
        itemPedido.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemPedidoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(itemPedido)))
            .andExpect(status().isBadRequest());

        // Validate the ItemPedido in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkQuantidadeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        itemPedido.setQuantidade(null);

        // Create the ItemPedido, which fails.

        restItemPedidoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(itemPedido)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrecoUnitarioIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        itemPedido.setPrecoUnitario(null);

        // Create the ItemPedido, which fails.

        restItemPedidoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(itemPedido)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllItemPedidos() throws Exception {
        // Initialize the database
        insertedItemPedido = itemPedidoRepository.saveAndFlush(itemPedido);

        // Get all the itemPedidoList
        restItemPedidoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemPedido.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantidade").value(hasItem(DEFAULT_QUANTIDADE)))
            .andExpect(jsonPath("$.[*].precoUnitario").value(hasItem(sameNumber(DEFAULT_PRECO_UNITARIO))));
    }

    @Test
    @Transactional
    void getItemPedido() throws Exception {
        // Initialize the database
        insertedItemPedido = itemPedidoRepository.saveAndFlush(itemPedido);

        // Get the itemPedido
        restItemPedidoMockMvc
            .perform(get(ENTITY_API_URL_ID, itemPedido.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemPedido.getId().intValue()))
            .andExpect(jsonPath("$.quantidade").value(DEFAULT_QUANTIDADE))
            .andExpect(jsonPath("$.precoUnitario").value(sameNumber(DEFAULT_PRECO_UNITARIO)));
    }

    @Test
    @Transactional
    void getNonExistingItemPedido() throws Exception {
        // Get the itemPedido
        restItemPedidoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemPedido() throws Exception {
        // Initialize the database
        insertedItemPedido = itemPedidoRepository.saveAndFlush(itemPedido);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the itemPedido
        ItemPedido updatedItemPedido = itemPedidoRepository.findById(itemPedido.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedItemPedido are not directly saved in db
        em.detach(updatedItemPedido);
        updatedItemPedido.quantidade(UPDATED_QUANTIDADE).precoUnitario(UPDATED_PRECO_UNITARIO);

        restItemPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemPedido.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedItemPedido))
            )
            .andExpect(status().isOk());

        // Validate the ItemPedido in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedItemPedidoToMatchAllProperties(updatedItemPedido);
    }

    @Test
    @Transactional
    void putNonExistingItemPedido() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        itemPedido.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemPedido.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(itemPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemPedido in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemPedido() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        itemPedido.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemPedidoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(itemPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemPedido in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemPedido() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        itemPedido.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemPedidoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(itemPedido)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemPedido in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemPedidoWithPatch() throws Exception {
        // Initialize the database
        insertedItemPedido = itemPedidoRepository.saveAndFlush(itemPedido);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the itemPedido using partial update
        ItemPedido partialUpdatedItemPedido = new ItemPedido();
        partialUpdatedItemPedido.setId(itemPedido.getId());

        partialUpdatedItemPedido.quantidade(UPDATED_QUANTIDADE);

        restItemPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedItemPedido))
            )
            .andExpect(status().isOk());

        // Validate the ItemPedido in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertItemPedidoUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedItemPedido, itemPedido),
            getPersistedItemPedido(itemPedido)
        );
    }

    @Test
    @Transactional
    void fullUpdateItemPedidoWithPatch() throws Exception {
        // Initialize the database
        insertedItemPedido = itemPedidoRepository.saveAndFlush(itemPedido);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the itemPedido using partial update
        ItemPedido partialUpdatedItemPedido = new ItemPedido();
        partialUpdatedItemPedido.setId(itemPedido.getId());

        partialUpdatedItemPedido.quantidade(UPDATED_QUANTIDADE).precoUnitario(UPDATED_PRECO_UNITARIO);

        restItemPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedItemPedido))
            )
            .andExpect(status().isOk());

        // Validate the ItemPedido in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertItemPedidoUpdatableFieldsEquals(partialUpdatedItemPedido, getPersistedItemPedido(partialUpdatedItemPedido));
    }

    @Test
    @Transactional
    void patchNonExistingItemPedido() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        itemPedido.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemPedido.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(itemPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemPedido in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemPedido() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        itemPedido.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemPedidoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(itemPedido))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemPedido in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemPedido() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        itemPedido.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemPedidoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(itemPedido)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemPedido in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemPedido() throws Exception {
        // Initialize the database
        insertedItemPedido = itemPedidoRepository.saveAndFlush(itemPedido);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the itemPedido
        restItemPedidoMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemPedido.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return itemPedidoRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected ItemPedido getPersistedItemPedido(ItemPedido itemPedido) {
        return itemPedidoRepository.findById(itemPedido.getId()).orElseThrow();
    }

    protected void assertPersistedItemPedidoToMatchAllProperties(ItemPedido expectedItemPedido) {
        assertItemPedidoAllPropertiesEquals(expectedItemPedido, getPersistedItemPedido(expectedItemPedido));
    }

    protected void assertPersistedItemPedidoToMatchUpdatableProperties(ItemPedido expectedItemPedido) {
        assertItemPedidoAllUpdatablePropertiesEquals(expectedItemPedido, getPersistedItemPedido(expectedItemPedido));
    }
}
