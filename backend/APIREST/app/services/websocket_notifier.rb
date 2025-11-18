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
    def notify_arquitecto_verificado(arquitecto, verificacion_id, moderador_id)
      return unless arquitecto.present?
      
      uri = URI("#{WS_SERVER_URL}/api/verificaciones/emit/aprobada")
      payload = {
        arquitecto_id: arquitecto.id.to_s,
        verificacion_id: verificacion_id.to_s,
        moderador_id: moderador_id.to_s,
        fecha_verificacion: Time.now.iso8601
      }
      
      send_to_endpoint(uri, payload, "arquitecto verificado")
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

    # =============== PROYECTOS ===============
    
    # Notificar cuando se crea un nuevo proyecto
    def notify_nuevo_proyecto(proyecto)
      return unless proyecto.present?
      
      uri = URI("#{WS_SERVER_URL}/api/proyectos/emit/nuevo")
      payload = {
        arquitecto_id: proyecto.arquitecto_id,
        proyecto: proyecto_to_json(proyecto)
      }
      
      send_to_endpoint(uri, payload, "nuevo proyecto")
    rescue => e
      Rails.logger.error "❌ Error notificando nuevo proyecto: #{e.message}"
    end
    
    # Notificar cuando se actualiza un proyecto
    def notify_proyecto_actualizado(proyecto)
      return unless proyecto.present?
      
      uri = URI("#{WS_SERVER_URL}/api/proyectos/emit/actualizado")
      payload = {
        proyecto_id: proyecto.id,
        arquitecto_id: proyecto.arquitecto_id,
        proyecto: proyecto_to_json(proyecto)
      }
      
      send_to_endpoint(uri, payload, "proyecto actualizado")
    rescue => e
      Rails.logger.error "❌ Error notificando proyecto actualizado: #{e.message}"
    end
    
    # Notificar cuando cambia el estado de un proyecto
    def notify_proyecto_estado_cambiado(proyecto, estado_anterior)
      return unless proyecto.present?
      
      uri = URI("#{WS_SERVER_URL}/api/proyectos/emit/estado")
      payload = {
        proyecto_id: proyecto.id,
        arquitecto_id: proyecto.arquitecto_id,
        cliente_id: proyecto.cliente_id,
        estado_anterior: estado_anterior,
        estado_nuevo: proyecto.tipo_proyecto,
        proyecto: proyecto_to_json(proyecto)
      }
      
      send_to_endpoint(uri, payload, "cambio de estado de proyecto")
    rescue => e
      Rails.logger.error "❌ Error notificando cambio de estado: #{e.message}"
    end
    
    # Notificar cuando se asigna un proyecto a un cliente
    def notify_proyecto_asignado(proyecto)
      return unless proyecto.present? && proyecto.cliente_id.present?
      
      uri = URI("#{WS_SERVER_URL}/api/proyectos/emit/asignado")
      payload = {
        cliente_id: proyecto.cliente_id,
        proyecto: proyecto_to_json(proyecto)
      }
      
      send_to_endpoint(uri, payload, "proyecto asignado")
    rescue => e
      Rails.logger.error "❌ Error notificando proyecto asignado: #{e.message}"
    end

    # =============== AVANCES ===============
    
    # Notificar cuando se crea un nuevo avance
    def notify_nuevo_avance(avance)
      return unless avance.present? && avance.proyecto.present?
      
      uri = URI("#{WS_SERVER_URL}/api/avances/emit/nuevo")
      payload = {
        proyecto_id: avance.proyecto_id,
        arquitecto_id: avance.proyecto.arquitecto_id,
        cliente_id: avance.proyecto.cliente_id,
        avance: avance_to_json(avance)
      }
      
      send_to_endpoint(uri, payload, "nuevo avance")
    rescue => e
      Rails.logger.error "❌ Error notificando nuevo avance: #{e.message}"
    end
    
    # Notificar cuando se actualiza un avance
    def notify_avance_actualizado(avance)
      return unless avance.present?
      
      uri = URI("#{WS_SERVER_URL}/api/avances/emit/actualizado")
      payload = {
        proyecto_id: avance.proyecto_id,
        avance: avance_to_json(avance)
      }
      
      send_to_endpoint(uri, payload, "avance actualizado")
    rescue => e
      Rails.logger.error "❌ Error notificando avance actualizado: #{e.message}"
    end
    
    # Notificar cuando se elimina un avance
    def notify_avance_eliminado(proyecto_id, avance_id)
      return unless proyecto_id.present? && avance_id.present?
      
      uri = URI("#{WS_SERVER_URL}/api/avances/emit/eliminado")
      payload = {
        proyecto_id: proyecto_id,
        avance_id: avance_id
      }
      
      send_to_endpoint(uri, payload, "avance eliminado")
    rescue => e
      Rails.logger.error "❌ Error notificando avance eliminado: #{e.message}"
    end

    # =============== INCIDENCIAS ===============
    
    # Notificar cuando se crea una nueva incidencia
    def notify_nueva_incidencia(incidencia)
      return unless incidencia.present?
      
      uri = URI("#{WS_SERVER_URL}/api/incidencias/emit/nueva")
      payload = {
        usuario_emisor_id: incidencia.usuario_emisor_id,
        usuario_infractor_id: incidencia.usuario_infractor_id,
        incidencia: incidencia_to_json(incidencia)
      }
      
      send_to_endpoint(uri, payload, "nueva incidencia")
    rescue => e
      Rails.logger.error "❌ Error notificando nueva incidencia: #{e.message}"
    end
    
    # Notificar cuando cambia el estado de una incidencia
    def notify_incidencia_estado_cambiado(incidencia, estado_anterior)
      return unless incidencia.present?
      
      uri = URI("#{WS_SERVER_URL}/api/incidencias/emit/estado")
      payload = {
        incidencia_id: incidencia.id,
        usuario_emisor_id: incidencia.usuario_emisor_id,
        usuario_infractor_id: incidencia.usuario_infractor_id,
        estado_anterior: estado_anterior,
        estado_nuevo: incidencia.estado,
        incidencia: incidencia_to_json(incidencia)
      }
      
      send_to_endpoint(uri, payload, "cambio de estado de incidencia")
    rescue => e
      Rails.logger.error "❌ Error notificando cambio de estado de incidencia: #{e.message}"
    end
    
    # Notificar cuando se asigna una incidencia a un moderador
    def notify_incidencia_asignada(incidencia)
      return unless incidencia.present? && incidencia.moderador_id.present?
      
      # Obtener el usuario_id del moderador
      moderador = Moderador.find_by(id: incidencia.moderador_id)
      return unless moderador&.usuario_id
      
      uri = URI("#{WS_SERVER_URL}/api/incidencias/emit/asignada")
      payload = {
        moderador_id: moderador.usuario_id,
        incidencia: incidencia_to_json(incidencia)
      }
      
      send_to_endpoint(uri, payload, "incidencia asignada")
    rescue => e
      Rails.logger.error "❌ Error notificando incidencia asignada: #{e.message}"
    end
    
    # Notificar cuando se resuelve una incidencia
    def notify_incidencia_resuelta(incidencia)
      return unless incidencia.present?
      
      uri = URI("#{WS_SERVER_URL}/api/incidencias/emit/resuelta")
      payload = {
        incidencia_id: incidencia.id,
        usuario_emisor_id: incidencia.usuario_emisor_id,
        usuario_infractor_id: incidencia.usuario_infractor_id,
        incidencia: incidencia_to_json(incidencia)
      }
      
      send_to_endpoint(uri, payload, "incidencia resuelta")
    rescue => e
      Rails.logger.error "❌ Error notificando incidencia resuelta: #{e.message}"
    end

    # =============== VALORACIONES ===============
    
    # Notificar cuando se crea una nueva valoración
    def notify_nueva_valoracion(valoracion)
      return unless valoracion.present? && valoracion.proyecto.present?
      
      uri = URI("#{WS_SERVER_URL}/api/valoraciones/emit/nueva")
      payload = {
        proyecto_id: valoracion.proyecto_id,
        arquitecto_id: valoracion.proyecto.arquitecto_id,
        cliente_id: valoracion.cliente_id,
        valoracion: valoracion_to_json(valoracion)
      }
      
      send_to_endpoint(uri, payload, "nueva valoración")
    rescue => e
      Rails.logger.error "❌ Error notificando nueva valoración: #{e.message}"
    end
    
    # Notificar cuando se actualiza el promedio de valoraciones del arquitecto
    def notify_valoracion_promedio_actualizado(arquitecto)
      return unless arquitecto.present?
      
      Rails.logger.info "📊 Notificando promedio actualizado para arquitecto #{arquitecto.id}"
      
      # Calcular total de valoraciones
      total = Valoracion.joins(proyecto: :arquitecto)
                       .where(proyectos: { arquitecto_id: arquitecto.id })
                       .count
      
      Rails.logger.info "   Promedio: #{arquitecto.valoracion_prom_proyecto}"
      Rails.logger.info "   Total valoraciones: #{total}"
      
      uri = URI("#{WS_SERVER_URL}/api/valoraciones/emit/promedio")
      payload = {
        arquitecto_id: arquitecto.id,
        valoracion_promedio: arquitecto.valoracion_prom_proyecto || 0.0,
        total_valoraciones: total
      }
      
      Rails.logger.info "   Enviando a: #{uri}"
      Rails.logger.info "   Payload: #{payload.to_json}"
      
      send_to_endpoint(uri, payload, "promedio de valoración actualizado")
    rescue => e
      Rails.logger.error "❌ Error notificando promedio actualizado: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
    
    # Notificar cuando se actualiza una valoración
    def notify_valoracion_actualizada(valoracion)
      return unless valoracion.present? && valoracion.proyecto.present?
      
      uri = URI("#{WS_SERVER_URL}/api/valoraciones/emit/actualizada")
      payload = {
        proyecto_id: valoracion.proyecto_id,
        arquitecto_id: valoracion.proyecto.arquitecto_id,
        valoracion: valoracion_to_json(valoracion)
      }
      
      send_to_endpoint(uri, payload, "valoración actualizada")
    rescue => e
      Rails.logger.error "❌ Error notificando valoración actualizada: #{e.message}"
    end
    
    # Notificar cuando se elimina una valoración
    def notify_valoracion_eliminada(proyecto_id, arquitecto_id, valoracion_id)
      return unless proyecto_id.present? && arquitecto_id.present? && valoracion_id.present?
      
      uri = URI("#{WS_SERVER_URL}/api/valoraciones/emit/eliminada")
      payload = {
        proyecto_id: proyecto_id,
        arquitecto_id: arquitecto_id,
        valoracion_id: valoracion_id
      }
      
      send_to_endpoint(uri, payload, "valoración eliminada")
    rescue => e
      Rails.logger.error "❌ Error notificando valoración eliminada: #{e.message}"
    end
    
    private
    
    # Enviar a un endpoint específico
    def send_to_endpoint(uri, payload, descripcion)
      http = Net::HTTP.new(uri.host, uri.port)
      http.open_timeout = 2
      http.read_timeout = 2
      
      request = Net::HTTP::Post.new(uri.path, {
        'Content-Type' => 'application/json',
        'Accept' => 'application/json'
      })
      
      request.body = payload.to_json
      
      response = http.request(request)
      
      if response.code.to_i >= 200 && response.code.to_i < 300
        Rails.logger.info "✅ WebSocket notificado: #{descripcion}"
      else
        Rails.logger.warn "⚠️ WebSocket respondió con código: #{response.code} para #{descripcion}"
      end
    rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH, Net::OpenTimeout, Net::ReadTimeout => e
      Rails.logger.warn "⚠️ No se pudo conectar al servidor WebSocket: #{e.class}"
    rescue => e
      Rails.logger.error "❌ Error enviando al WebSocket (#{descripcion}): #{e.message}"
    end
    
    # Serializar proyecto
    def proyecto_to_json(proyecto)
      {
        id: proyecto.id,
        titulo_proyecto: proyecto.titulo_proyecto,
        descripcion: proyecto.descripcion,
        tipo_proyecto: proyecto.tipo_proyecto,
        valoracion_promedio: proyecto.valoracion_promedio,
        fecha_publicacion: proyecto.fecha_publicacion,
        arquitecto_id: proyecto.arquitecto_id,
        cliente_id: proyecto.cliente_id,
        conversacion_id: proyecto.conversacion_id,
        created_at: proyecto.created_at,
        updated_at: proyecto.updated_at
      }
    end
    
    # Serializar avance
    def avance_to_json(avance)
      {
        id: avance.id,
        descripcion: avance.descripcion,
        fecha: avance.fecha,
        proyecto_id: avance.proyecto_id,
        created_at: avance.created_at,
        updated_at: avance.updated_at
      }
    end
    
    # Serializar incidencia
    def incidencia_to_json(incidencia)
      {
        id: incidencia.id,
        descripcion: incidencia.descripcion,
        estado: incidencia.estado,
        fecha: incidencia.fecha,
        usuario_emisor_id: incidencia.usuario_emisor_id,
        usuario_infractor_id: incidencia.usuario_infractor_id,
        moderador_id: incidencia.moderador_id,
        created_at: incidencia.created_at,
        updated_at: incidencia.updated_at
      }
    end
    
    # Serializar valoración
    def valoracion_to_json(valoracion)
      {
        id: valoracion.id,
        calificacion: valoracion.calificacion,
        comentario: valoracion.comentario,
        fecha: valoracion.fecha,
        cliente_id: valoracion.cliente_id,
        proyecto_id: valoracion.proyecto_id,
        created_at: valoracion.created_at,
        updated_at: valoracion.updated_at
      }
    end
    
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
