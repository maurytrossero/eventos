<template>
  <section class="pricing-view">
    <h1>Planes y Precios</h1>
    <p>Elegí el plan que mejor se ajuste a tu evento.</p>

    <div class="plans">
      <div class="plan basic animate-up">
        <h2>Plan Básico</h2>
        <p class="price">Gratis</p>
        <ul>
          <li>✔ Invitaciones personalizadas</li>
          <li>✔ Confirmación de asistencia</li>
          <li>❌ Galería en tiempo real</li>
          <li>❌ Trivia interactiva</li>
        </ul>
        <router-link to="/register" class="btn">Registrate</router-link>
      </div>

      <div class="plan premium animate-up">
        <h2>Plan Premium</h2>
        <p class="price">$2500</p>
        <ul>
          <li>✔ Todo lo del Plan Básico</li>
          <li>✔ Galería en tiempo real</li>
          <li>✔ Trivia interactiva</li>
          <li>✔ Dominio personalizado</li>
        </ul>
        <router-link to="/checkout" class="btn btn-highlight">Contratar</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
// sin lógica por ahora
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

.pricing-view {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem 3rem;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  color: #1f2d3d;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

/* Títulos */
.pricing-view h1 {
  font-size: 2.5rem;
  color: #406d9e;
  margin-bottom: 1rem;
  animation: fadeInDown 0.7s ease;
}

.pricing-view p {
  font-size: 1.2rem;
  color: #34495e;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease;
}

/* Planes */
.plans {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.plan {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  flex: 1 1 280px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.plan:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.12);
}

.plan h2 {
  color: #2c4a77;
  font-size: 1.5rem;
}

.price {
  font-size: 2rem;
  margin: 1rem 0;
  color: #b98b4e;
  font-weight: bold;
}

.plan ul {
  text-align: left;
  margin: 1rem 0;
  padding-left: 1rem;
  color: #34495e;
}

/* Botones */
.btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #2c4a77;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s;
}

.btn:hover {
  background: #1b2f50;
}

.btn-highlight {
  background: #b98b4e;
}

.btn-highlight:hover {
  background: #9a733b;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-up {
  animation: fadeInUp 0.8s ease;
}

/* 🌙 Modo oscuro automático */
@media (prefers-color-scheme: dark) {
  .pricing-view {
    background-color: #1e1e2f;
    color: #f5f5f5;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  }

  .pricing-view h1 {
    color: #cfcaa5;
  }

  .pricing-view p {
    color: #dcdcdc;
  }

  .plan {
    background-color: #2e3b4e;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.5);
  }

  .plan h2 {
    color: #e0e0e0;
  }

  .plan ul {
    color: #d6d6d6;
  }

  .btn {
    background-color: #406d9e;
  }

  .btn:hover {
    background-color: #2b4e78;
  }

  .btn-highlight {
    background-color: #d4a755;
  }

  .btn-highlight:hover {
    background-color: #b98b4e;
  }
}
</style>

