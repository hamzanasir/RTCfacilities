Rails.application.routes.draw do
  get '/stuart', to: 'maps#stuart', as: 'stuart'

  get '/alumini', to: 'maps#alumini', as: 'alumini'

  root 'landing#index'

  resources :buildings

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
