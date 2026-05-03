package com.petfinder.petfinderapi.controller;

import com.petfinder.petfinderapi.dto.ConversaDTO;
import com.petfinder.petfinderapi.dto.MissatgeDTO;
import com.petfinder.petfinderapi.dto.request.EnviarMissatgeDTO;
import com.petfinder.petfinderapi.service.MissatgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/missatges")
public class MissatgeController {

    private final MissatgeService missatgeService;

    public MissatgeController(MissatgeService missatgeService) {
        this.missatgeService = missatgeService;
    }

    @PostMapping("/enviar")
    public ResponseEntity<?> enviarMissatge(@RequestBody EnviarMissatgeDTO dto) {
        missatgeService.enviarMissatge(dto);
        return ResponseEntity.ok().body("Missatge enviat correctament");
    }

    @GetMapping("/converses")
    public ResponseEntity<List<ConversaDTO>> obtenirConverses(@RequestParam Long usuariId) {
        return ResponseEntity.ok(missatgeService.obtenirConversesPerUsuari(usuariId));
    }

    @GetMapping("/conversa/{conversaId}")
    public ResponseEntity<List<MissatgeDTO>> obtenirMissatges(
            @PathVariable Long conversaId,
            @RequestParam Long usuariId) {
        return ResponseEntity.ok(missatgeService.obtenirMissatgesPerConversa(conversaId, usuariId));
    }

    @GetMapping("/no-llegits")
    public ResponseEntity<Integer> obtenirMissatgesNoLlegits(@RequestParam Long usuariId) {
        return ResponseEntity.ok(missatgeService.obtenirTotalMissatgesNoLlegits(usuariId));
    }
}