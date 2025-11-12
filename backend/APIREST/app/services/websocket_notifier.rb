# Servicio para enviar eventos al servidor WebSocket de NestJS
require 'net/http'
require 'json'

class WebsocketNotifier
  # URL del servidor WebSocket de NestJS
  WS_SERVER_URL = ENV.fetch('WEBSOCKET_SERVER_URL', 'http://localhost:3006')
  
  class << self
    # Notificar cuando se crea un proyecto
    def notify_proyecto_creado(proyecto)
      return unless proyecto.present?
      
      payload = {
        evento: 'proyecto:creado',
        data: {
          proyecto_id: proyecto.id,
          titulo: proyecto.titulo_proyecto,
          descripcion: proyecto.descripcion,
          cliente_id: proyecto.cliente_id,
          arquitecto_id: proyecto.arquitecto_id,
          timestamp: Time.now.iso8601
        }
      }
      
      send_notification(payload, proyecto.cliente_id)
    rescue => e
      Rails.logger.error "❌ Error notificando proyecto creado: #{e.message}"
    end
    
    # Notificar cuando un arquitecto es verificado
    def notify_arquitecto_verificado(arquitecto)
      return unless arquitecto.present?
      
      payload = {
        evento: 'arquitecto:verificado',
        data: {
          arquitecto_id: arquitecto.id,
          usuario_id: arquitecto.usuario_id,
          nombre: arquitecto.nombre,
          apellido: arquitecto.apellido,
          verificado: arquitecto.verificado,
          timestamp: Time.now.iso8601
        }
      }
      
      send_notification(payload, arquitecto.usuario_id)
    rescue => e
      Rails.logger.error "❌ Error notificando arquitecto verificado: #{e.message}"
    end
    
    # Notificar cuando un arquitecto es rechazado
    def notify_arquitecto_rechazado(arquitecto)
      return unless arquitecto.present?
      
      payload = {
        evento: 'arquitecto:rechazado',
        data: {
          arquitecto_id: arquitecto.id,
          usuario_id: arquitecto.usuario_id,
          nombre: arquitecto.nombre,
          apellido: arquitecto.apellido,
          verificado: arquitecto.verificado,
          timestamp: Time.now.iso8601
        }
      }
      
      send_notification(payload, arquitecto.usuario_id)
    rescue => e
      Rails.logger.error "❌ Error notificando arquitecto rechazado: #{e.message}"
    end
    
    # Notificar cuando se crea una conversación
    def notify_conversation_created(conversacion)
      return unless conversacion.present?
      
      payload = {
        evento: 'conversacion:creada',
        data: {
          conversacion_id: conversacion.id,
          cliente_id: conversacion.cliente_id,
          arquitecto_id: conversacion.arquitecto_id,
          fecha: conversacion.fecha,
          timestamp: Time.now.iso8601
        }
      }
      
      # Notificar tanto al cliente como al arquitecto
      send_notification(payload, conversacion.cliente.usuario_id) if conversacion.cliente
      send_notification(payload, conversacion.arquitecto.usuario_id) if conversacion.arquitecto
    rescue => e
      Rails.logger.error "❌ Error notificando conversación creada: #{e.message}"
    end
    
    private
    
    # Enviar notificación al servidor WebSocket
    def send_notification(payload, usuario_id = nil)
      uri = URI("#{WS_SERVER_URL}/api/notificaciones/emit")
      
      http = Net::HTTP.new(uri.host, uri.port)
      http.open_timeout = 2
      http.read_timeout = 2
      
      request = Net::HTTP::Post.new(uri.path, {
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      })
      
      body = payload.dup
      body[:usuario_id] = usuario_id if usuario_id
      request.body = body.to_json
      
      response = http.request(request)
      
      if response.code.to_i >= 200 && response.code.to_i < 300
        Rails.logger.info "✅ Notificación enviada al WebSocket: #{payload[:evento]}"
      else
        Rails.logger.warn "⚠️ WebSocket respondió con código: #{response.code}"
      end
    rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH, Net::OpenTimeout, Net::ReadTimeout => e
      Rails.logger.warn "⚠️ No se pudo conectar al servidor WebSocket: #{e.class}"
      # No lanzar error para no interrumpir el flujo principal
    rescue => e
      Rails.logger.error "❌ Error enviando al WebSocket: #{e.message}"
      Rails.logger.error e.backtrace.first(5).join("\n")
    end
  end
end
