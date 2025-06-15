<!-- invitation-type/WeddingView.vue -->
<template>
  <div class="home">
    <div ref="introductionComponentRef"><IntroductionComponent /></div>

    <!-- Usamos evento.value en el script, pero en el template accedemos como evento?.fecha -->
    <div ref="countDownRef">
      <CountDown :fecha-evento="evento?.fecha" />
    </div>

    <div ref="eventPhothosRef"><EventPhothos /></div>
    <div ref="weddingInvitationRef"><WeddingInvitation /></div>
    <div ref="eventLocationRef"><EventLocation /></div>
    <div ref="partyManagementRef"><PartyManagement /></div>

    <FooterMusic ref="footerMusicRef" v-if="showFooterMusic" />

    <!-- Botones de desplazamiento -->
    <button class="scroll-btn up" @click="scroll('up')">▲</button>
    <button class="scroll-btn down" @click="scroll('down')">▼</button>
  </div>
</template>

<script lang="ts" setup>
  import { ref, toRefs } from 'vue';
  import IntroductionComponent from '@/components/wedding/IntroductionComponent.vue';
  import CountDown from '@/components/wedding/CountdownComponent.vue';
  import EventPhothos from '@/components/wedding/EventPhothos.vue';
  import WeddingInvitation from '@/components/wedding/WeddingInvitation.vue';
  import EventLocation from '@/components/wedding/EventLocation.vue';
  import PartyManagement from '@/components/wedding/PartyManagement.vue';
  import FooterMusic from '@/components/wedding/FooterMusic.vue';

  // ✅ Recibimos props de manera reactiva
  const props = defineProps<{ evento: any }>();
  const { evento } = toRefs(props); // ✅ mantiene la reactividad

  // Refs de cada sección
  const introductionComponentRef = ref<HTMLElement | null>(null);
  const countDownRef = ref<HTMLElement | null>(null);
  const eventPhothosRef = ref<HTMLElement | null>(null);
  const weddingInvitationRef = ref<HTMLElement | null>(null);
  const eventLocationRef = ref<HTMLElement | null>(null);
  const partyManagementRef = ref<HTMLElement | null>(null);
  const footerMusicRef = ref<InstanceType<typeof FooterMusic> | null>(null);

  const showFooterMusic = ref(true);

  const refs = [
    introductionComponentRef,
    countDownRef,
    eventPhothosRef,
    weddingInvitationRef,
    eventLocationRef,
    partyManagementRef
  ];

  const currentIndex = ref(0);

  const scroll = (direction: 'up' | 'down') => {
    if (refs.length === 0) return;

    if (direction === 'up' && currentIndex.value > 0) currentIndex.value--;
    else if (direction === 'down' && currentIndex.value < refs.length - 1) currentIndex.value++;

    const targetRef = refs[currentIndex.value];
    if (targetRef?.value) {
      window.scrollTo({
        top: targetRef.value.offsetTop,
        behavior: 'smooth'
      });
    }
  };
</script>

<style scoped>
    .home {
        text-align: center;
        padding: 20px;
        position: relative;
        min-height: 200vh;
    }
    
    /* Estilos para los botones de desplazamiento */
    .scroll-btn {
        position: fixed;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        font-size: 1.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 1000;
    }
    
    .scroll-btn.up { bottom: 150px; left: 50%; transform: translateX(-50%); }
    .scroll-btn.down { bottom: 100px; left: 50%; transform: translateX(-50%); }
    
    @media (max-width: 768px) {
        .scroll-btn { width: 35px; height: 35px; font-size: 1.2em; }
        .scroll-btn.up { bottom: 110px; }
        .scroll-btn.down { bottom: 70px; }
    }
</style>
  