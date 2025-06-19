package lojavirtual.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ProdutoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Produto getProdutoSample1() {
        return new Produto().id(1L).nome("nome1").descricao("descricao1").quantidade(1);
    }

    public static Produto getProdutoSample2() {
        return new Produto().id(2L).nome("nome2").descricao("descricao2").quantidade(2);
    }

    public static Produto getProdutoRandomSampleGenerator() {
        return new Produto()
            .id(longCount.incrementAndGet())
            .nome(UUID.randomUUID().toString())
            .descricao(UUID.randomUUID().toString())
            .quantidade(intCount.incrementAndGet());
    }
}
