<script setup>
import { ref, watch } from 'vue';
import { useVirtualList } from '@vueuse/core';
import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query';
import { createProduct, fetchProduct } from '../api/product.js';

// ==== Refs, constants, vars ====
const filteredProducts = ref([]);
const queryClient = useQueryClient();

// ==== Fetchers ====
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProduct,
});

// ==== Mutations ====
const {
  isPending: isPendingMutation,
  mutate,
  variables,
  reset,
} = useMutation({
  mutationFn: createProduct,
  onMutate: async (data) => {
    await queryClient.cancelQueries({ queryKey: ['products'] });
    const previousProducts = queryClient.getQueryData(['products']);

    queryClient.setQueryData(['products'], (prev) => ({
      ...prev,
      products: [...prev.products, data],
    }));

    return { previousProducts };
  },

  onError: (err, newProduct, context) => {
    queryClient.setQueryData(['products'], context.previousProducts);
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
});

// ==== Computed and Watchers ====
watch(data, (newVal) => {
  filteredProducts.value = [...filteredProducts.value, ...newVal.products];
});

// ==== Handlers ====
const addProduct = () => {
  mutate({ title: 'New product title' });
};

const refetchProducts = async () => {
  reset();
  await queryClient.cancelQueries({ queryKey: ['products'] });
  await queryClient.invalidateQueries({ queryKey: ['products'] });
};

// ==== Composables ====
const { list, containerProps, wrapperProps } = useVirtualList(
  filteredProducts,
  { itemHeight: 33 }
);
</script>

<template>
  <main>
    <div v-bind="containerProps" class="scrollContainer">
      <div v-bind="wrapperProps">
        <div v-if="isPendingMutation" class="scrollItem optimistical">
          {{ variables.title }}
        </div>
        <div
          v-for="item in list"
          :key="item.index"
          :dataIndex="item.index"
          class="scrollItem"
        >
          {{ item.data.title }}
        </div>
      </div>
    </div>

    <div>
      <!-- Mutation uses https://dummyjson.com to emulate POST request
      Once queries invalidated aftes mutation settled the list beeing updated. 
      So optimistical value dissapear -->
      <button @click="addProduct" class="btn button-23">
        Add to the beginning
      </button>
      <button @click="refetchProducts" class="btn button-23">Refetch</button>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  justify-content: center;
}

.optimistical {
  opacity: 0.5;
}

.scrollItem {
  font-size: 1.25rem;
  line-height: 1.15;
  margin: 0.625rem 0;
  font-family: sans-serif;
}

.scrollContainer {
  height: 14rem;
  border: solid 0.0625rem #fff;
  padding: 0 0.625rem;
  width: 25rem;
  border-radius: 0.5rem;
  margin-right: 0.625rem;
}

.btn {
  display: block;
  margin-bottom: 0.625rem;
}
</style>
