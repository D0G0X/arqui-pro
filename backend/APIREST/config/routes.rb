Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    namespace :v1 do
      devise_for :usuarios,
      controllers: {
        registrations: 'usuarios/registrations',
        sessions: 'usuarios/sessions'
      },
      defaults: { format: :json }
      resources :usuarios
      resources :clientes
      resources :arquitectos
      resources :moderadores
      resources :conversaciones
      resources :notificaciones
      resources :verificaciones
      resources :solicitudes_proyecto
      resources :proyectos
      resources :avances
      resources :incidencias
      resources :valoraciones
      resources :mensajes
      resources :imagenes
      resources :imagen_asociaciones
    end
  end
end
