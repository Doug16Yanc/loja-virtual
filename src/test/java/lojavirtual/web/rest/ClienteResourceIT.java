package lojavirtual.web.rest;

import static lojavirtual.domain.ClienteAsserts.*;
import static lojavirtual.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import lojavirtual.IntegrationTest;
import lojavirtual.domain.Cliente;
import lojavirtual.repository.ClienteRepository;
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
 * Integration tests for the {@link ClienteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClienteResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "X@cipr\\e)/d";
    private static final String UPDATED_EMAIL = "[@%V\\F(r";

    private static final String DEFAULT_TELEFONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/clientes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClienteMockMvc;

    private Cliente cliente;

    private Cliente insertedCliente;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cliente createEntity() {
        return new Cliente().nome(DEFAULT_NOME).email(DEFAULT_EMAIL).telefone(DEFAULT_TELEFONE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Cliente createUpdatedEntity() {
        return new Cliente().nome(UPDATED_NOME).email(UPDATED_EMAIL).telefone(UPDATED_TELEFONE);
    }

    @BeforeEach
    void initTest() {
        cliente = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedCliente != null) {
            clienteRepository.delete(insertedCliente);
            insertedCliente = null;
        }
    }

    @Test
    @Transactional
    void createCliente() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Cliente
        var returnedCliente = om.readValue(
            restClienteMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cliente)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Cliente.class
        );

        // Validate the Cliente in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertClienteUpdatableFieldsEquals(returnedCliente, getPersistedCliente(returnedCliente));

        insertedCliente = returnedCliente;
    }

    @Test
    @Transactional
    void createClienteWithExistingId() throws Exception {
        // Create the Cliente with an existing ID
        cliente.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClienteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cliente)))
            .andExpect(status().isBadRequest());

        // Validate the Cliente in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cliente.setNome(null);

        // Create the Cliente, which fails.

        restClienteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cliente)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        cliente.setEmail(null);

        // Create the Cliente, which fails.

        restClienteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cliente)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllClientes() throws Exception {
        // Initialize the database
        insertedCliente = clienteRepository.saveAndFlush(cliente);

        // Get all the clienteList
        restClienteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cliente.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].telefone").value(hasItem(DEFAULT_TELEFONE)));
    }

    @Test
    @Transactional
    void getCliente() throws Exception {
        // Initialize the database
        insertedCliente = clienteRepository.saveAndFlush(cliente);

        // Get the cliente
        restClienteMockMvc
            .perform(get(ENTITY_API_URL_ID, cliente.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(cliente.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.telefone").value(DEFAULT_TELEFONE));
    }

    @Test
    @Transactional
    void getNonExistingCliente() throws Exception {
        // Get the cliente
        restClienteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCliente() throws Exception {
        // Initialize the database
        insertedCliente = clienteRepository.saveAndFlush(cliente);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cliente
        Cliente updatedCliente = clienteRepository.findById(cliente.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCliente are not directly saved in db
        em.detach(updatedCliente);
        updatedCliente.nome(UPDATED_NOME).email(UPDATED_EMAIL).telefone(UPDATED_TELEFONE);

        restClienteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCliente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCliente))
            )
            .andExpect(status().isOk());

        // Validate the Cliente in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedClienteToMatchAllProperties(updatedCliente);
    }

    @Test
    @Transactional
    void putNonExistingCliente() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cliente.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClienteMockMvc
            .perform(put(ENTITY_API_URL_ID, cliente.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cliente)))
            .andExpect(status().isBadRequest());

        // Validate the Cliente in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCliente() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cliente.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClienteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(cliente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cliente in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCliente() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cliente.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClienteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(cliente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cliente in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClienteWithPatch() throws Exception {
        // Initialize the database
        insertedCliente = clienteRepository.saveAndFlush(cliente);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cliente using partial update
        Cliente partialUpdatedCliente = new Cliente();
        partialUpdatedCliente.setId(cliente.getId());

        partialUpdatedCliente.nome(UPDATED_NOME);

        restClienteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCliente.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCliente))
            )
            .andExpect(status().isOk());

        // Validate the Cliente in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClienteUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCliente, cliente), getPersistedCliente(cliente));
    }

    @Test
    @Transactional
    void fullUpdateClienteWithPatch() throws Exception {
        // Initialize the database
        insertedCliente = clienteRepository.saveAndFlush(cliente);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the cliente using partial update
        Cliente partialUpdatedCliente = new Cliente();
        partialUpdatedCliente.setId(cliente.getId());

        partialUpdatedCliente.nome(UPDATED_NOME).email(UPDATED_EMAIL).telefone(UPDATED_TELEFONE);

        restClienteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCliente.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCliente))
            )
            .andExpect(status().isOk());

        // Validate the Cliente in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClienteUpdatableFieldsEquals(partialUpdatedCliente, getPersistedCliente(partialUpdatedCliente));
    }

    @Test
    @Transactional
    void patchNonExistingCliente() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cliente.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClienteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, cliente.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cliente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cliente in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCliente() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cliente.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClienteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(cliente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Cliente in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCliente() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        cliente.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClienteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(cliente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Cliente in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCliente() throws Exception {
        // Initialize the database
        insertedCliente = clienteRepository.saveAndFlush(cliente);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the cliente
        restClienteMockMvc
            .perform(delete(ENTITY_API_URL_ID, cliente.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return clienteRepository.count();
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

    protected Cliente getPersistedCliente(Cliente cliente) {
        return clienteRepository.findById(cliente.getId()).orElseThrow();
    }

    protected void assertPersistedClienteToMatchAllProperties(Cliente expectedCliente) {
        assertClienteAllPropertiesEquals(expectedCliente, getPersistedCliente(expectedCliente));
    }

    protected void assertPersistedClienteToMatchUpdatableProperties(Cliente expectedCliente) {
        assertClienteAllUpdatablePropertiesEquals(expectedCliente, getPersistedCliente(expectedCliente));
    }
}
