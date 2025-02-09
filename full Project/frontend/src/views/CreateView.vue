<template>
    <div class="q-gutter-md" style="max-width: 400px;">
      <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
        <q-input v-model="first_name" label="First Name" required />
        <q-input v-model="last_name" label="Last Name" required />
        <q-input v-model="email" label="Email" type="email" required />
        <q-input v-model="address" label="Address" required />
        <q-input v-model="phone_number" label="Phone Number" required />
        <q-btn type="submit" label="Submit" color="primary" :disable="loading" />
      </q-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const first_name = ref("");
  const last_name = ref("");
  const email = ref("");
  const address = ref("");
  const phone_number = ref("");
  const loading = ref(false);
  
  const handleSubmit = async () => {
    loading.value = true;
    try {
      const response = await fetch("http://localhost:8800/api/v1/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: first_name.value,
          last_name: last_name.value,
          email: email.value,
          address: address.value,
          phone_number: phone_number.value,
        }),
      });
      const result = await response.json();
      alert(result.message);
      if (result.success === "ok") {
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    } finally {
      loading.value = false;
    }
  };
  </script>
  