<template>
    <div class="min-h-screen bg-[#0a0118] relative overflow-hidden flex">

        <!-- Grid pattern background -->
        <div class="absolute inset-0 bg-grid-pattern opacity-20"></div>

        <!-- Gradient orbs -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div
                class="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full blur-3xl opacity-30 animate-float">
            </div>
            <div
                class="absolute top-1/2 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-30 animate-float-delayed">
            </div>
            <div
                class="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full blur-3xl opacity-30 animate-float-slow">
            </div>
        </div>

        <!-- Sidebar Neomorphic -->
        <aside :class="sidebarOpen ? 'w-80' : 'w-20'"
            class="relative z-20 transition-all duration-500 ease-out border-r border-white/5 backdrop-blur-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01]">

            <!-- Header -->
            <div class="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <transition name="logo-fade">
                    <div v-if="sidebarOpen" class="flex items-center gap-3">
                        <div class="relative">
                            <div
                                class="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 p-[2px] shadow-lg shadow-violet-500/50">
                                <div class="w-full h-full rounded-2xl bg-[#0a0118] flex items-center justify-center">
                                    <svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse">
                            </div>
                        </div>
                        <div>
                            <h1 class="text-white font-bold text-lg tracking-tight">FinanceHub</h1>
                            <p class="text-xs text-violet-400/80 font-medium">v2.5.0</p>
                        </div>
                    </div>
                </transition>

                <button @click="toggleSidebar"
                    class="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 group">
                    <svg class="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <!-- Navigation -->
            <nav class="p-4 space-y-2">
                <router-link to="/dashboard" custom v-slot="{ navigate, isActive }">
                    <button @click="navigate" :class="[
                        'w-full group relative overflow-hidden rounded-2xl transition-all duration-300',
                        sidebarOpen ? 'h-14' : 'h-14',
                        isActive
                            ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 shadow-lg shadow-violet-500/20'
                            : 'hover:bg-white/5'
                    ]">
                        <div v-if="isActive"
                            class="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-10"></div>
                        <div :class="[
                            'relative z-10 flex items-center h-full px-4',
                            sidebarOpen ? 'justify-start gap-4' : 'justify-center'
                        ]">
                            <div :class="[
                                'flex items-center justify-center rounded-xl transition-all duration-300',
                                isActive ? 'w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50' : 'w-10 h-10 bg-white/5'
                            ]">
                                <svg class="w-5 h-5" :class="isActive ? 'text-white' : 'text-white/60'" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <span v-if="sidebarOpen"
                                :class="['font-semibold transition-colors', isActive ? 'text-white' : 'text-white/60 group-hover:text-white']">
                                Dashboard
                            </span>
                        </div>
                        <div v-if="isActive"
                            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full">
                        </div>
                    </button>
                </router-link>

                <router-link to="/gastos" custom v-slot="{ navigate, isActive }">
                    <button @click="navigate" :class="[
                        'w-full group relative overflow-hidden rounded-2xl transition-all duration-300',
                        sidebarOpen ? 'h-14' : 'h-14',
                        isActive
                            ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 shadow-lg shadow-violet-500/20'
                            : 'hover:bg-white/5'
                    ]">
                        <div v-if="isActive"
                            class="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-10"></div>
                        <div :class="[
                            'relative z-10 flex items-center h-full px-4',
                            sidebarOpen ? 'justify-start gap-4' : 'justify-center'
                        ]">
                            <div :class="[
                                'flex items-center justify-center rounded-xl transition-all duration-300',
                                isActive ? 'w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50' : 'w-10 h-10 bg-white/5'
                            ]">
                                <svg class="w-5 h-5" :class="isActive ? 'text-white' : 'text-white/60'" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span v-if="sidebarOpen"
                                :class="['font-semibold transition-colors', isActive ? 'text-white' : 'text-white/60 group-hover:text-white']">
                                Gastos
                            </span>
                        </div>
                        <div v-if="isActive"
                            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full">
                        </div>
                    </button>
                </router-link>

                <router-link to="/categorias" custom v-slot="{ navigate, isActive }">
                    <button @click="navigate" :class="[
                        'w-full group relative overflow-hidden rounded-2xl transition-all duration-300',
                        sidebarOpen ? 'h-14' : 'h-14',
                        isActive
                            ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 shadow-lg shadow-violet-500/20'
                            : 'hover:bg-white/5'
                    ]">
                        <div v-if="isActive"
                            class="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-10"></div>
                        <div :class="[
                            'relative z-10 flex items-center h-full px-4',
                            sidebarOpen ? 'justify-start gap-4' : 'justify-center'
                        ]">
                            <div :class="[
                                'flex items-center justify-center rounded-xl transition-all duration-300',
                                isActive ? 'w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50' : 'w-10 h-10 bg-white/5'
                            ]">
                                <svg class="w-5 h-5" :class="isActive ? 'text-white' : 'text-white/60'" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <span v-if="sidebarOpen"
                                :class="['font-semibold transition-colors', isActive ? 'text-white' : 'text-white/60 group-hover:text-white']">
                                Categorías
                            </span>
                        </div>
                        <div v-if="isActive"
                            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full">
                        </div>
                    </button>
                </router-link>
            </nav>

            <!-- User Profile -->
            <div
                class="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-xl">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div
                            class="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 p-[2px]">
                            <div class="w-full h-full rounded-2xl bg-[#0a0118] flex items-center justify-center">
                                <span class="text-sm font-bold text-white">{{ userInitials }}</span>
                            </div>
                        </div>
                        <div
                            class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0a0118]">
                        </div>
                    </div>

                    <transition name="logo-fade">
                        <div v-if="sidebarOpen" class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-white truncate">{{ userName }}</p>
                            <p class="text-xs text-white/50 truncate">{{ userEmail }}</p>
                        </div>
                    </transition>

                    <button @click="handleLogout"
                        class="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all duration-300 group">
                        <svg class="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto relative z-10">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const auth = useAuthStore();

const sidebarOpen = ref(true);

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

const userName = computed(() => auth.user?.nombre || 'Usuario');
const userEmail = computed(() => auth.user?.correo || 'usuario@ejemplo.com');
const userInitials = computed(() => {
    const name = userName.value.split(' ');
    if (name.length >= 2) {
        return (name[0][0] + name[1][0]).toUpperCase();
    }
    return name[0][0].toUpperCase();
});

const handleLogout = async () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        await auth.logout();
        router.push('/login');
    }
};
</script>

<style scoped>
/* Grid pattern background */
.bg-grid-pattern {
    background-image:
        linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
}

/* Floating animations */
@keyframes float {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    33% {
        transform: translate(30px, -30px) rotate(120deg);
    }

    66% {
        transform: translate(-20px, 20px) rotate(240deg);
    }
}

@keyframes float-delayed {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }

    33% {
        transform: translate(-30px, 30px) rotate(-120deg);
    }

    66% {
        transform: translate(20px, -20px) rotate(-240deg);
    }
}

@keyframes float-slow {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    50% {
        transform: translate(20px, -40px) scale(1.1);
    }
}

.animate-float {
    animation: float 25s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 30s ease-in-out infinite;
}

.animate-float-slow {
    animation: float-slow 35s ease-in-out infinite;
}

/* Logo fade transition */
.logo-fade-enter-active,
.logo-fade-leave-active {
    transition: all 0.3s ease;
}

.logo-fade-enter-from,
.logo-fade-leave-to {
    opacity: 0;
    transform: translateX(-10px);
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.5);
}
</style>